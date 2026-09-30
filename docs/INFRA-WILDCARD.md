# Wildcard de subdominios multi-tenant (Cloudflare + Coolify/Traefik)

Receta para que cada cliente de una app viva en su propio host —**`<slug>.<dominio>`**—
sin dar de alta nada por cliente, con **certificado wildcard válido**, y **sin tocar**
los hosts de plataforma (`app`, `clientes`, `demo`, `www`, apex).

Caso de referencia probado: **Agendese** (`*.agendese.online` → micrositio por
empresa en `/` y área de cliente en `/cliente`; apex/app/clientes/demo intactos).
El mismo procedimiento aplica a cualquier app del grupo: cambiar `<dominio>` y el
`service` del router.

> **Cómo lo resuelve la app:** el wildcard solo lleva el tráfico al mismo
> servicio. La resolución del tenant (qué empresa atiende cada host) vive en el
> código: middleware que reescribe `/` al portal de la empresa según el hostname,
> con fallback por ruta (`/reservar/<slug>`) para compatibilidad. DNS/TLS no
> saben de tenants.

## 0. Precondiciones

- Zona `<dominio>` en **Cloudflare** con modo **SSL/TLS → Full (strict)**.
- **Coolify** con Traefik como proxy y la app sirviendo (`https://app.<dominio>/api/health` OK).
- Copiar del dashboard el **destino exacto del registro `app`** (tipo `A`/`CNAME` y contenido). **No inventar targets.**

## 1. Cloudflare — registro DNS wildcard

| Campo | Valor |
| --- | --- |
| Type | el mismo tipo que `app` (normalmente `A`) |
| Name | `*` |
| Content | el mismo destino que `app` |
| Proxy status | **Proxied** (recomendado) |

- Los registros específicos (`app`, `clientes`, `demo`, `www`) tienen **prioridad**: no se tocan.
- El wildcard cubre **solo el primer nivel** (`<slug>.<dominio>`): no cubre el apex ni anidados (`x.<slug>.<dominio>`).
- Proxied: el Universal SSL de Cloudflare ya cubre `*.<dominio>` en todos los planes (el proxy toma el cert de borde).

Verificar: `dig +short <slug>.<dominio> A`

## 2. Cloudflare — token de API para el DNS challenge

- **My Profile → API Tokens → Create Token** → plantilla **Edit zone DNS**.
- **Zone Resources**: Include → *Specific zone* → `<dominio>`; permiso `Zone / DNS / Edit`.
- **El token queda limitado a esa zona** (no usar tokens globales ni compartidos entre apps).
- Se muestra una sola vez: va **únicamente** en Coolify (nunca al repo).

## 3. Coolify — Traefik con DNS-01 (challenge por DNS)

En **Servers → server → Proxy → Configuration**, servicio `traefik`:

```yaml
services:
  traefik:
    environment:
      - CF_DNS_API_TOKEN=<token-de-cloudflare>
    command:
      # Mantener el resto de los flags existentes.
      - '--certificatesresolvers.letsencrypt.acme.dnschallenge.provider=cloudflare'
      - '--certificatesresolvers.letsencrypt.acme.dnschallenge.delaybeforecheck=0'
      - '--certificatesresolvers.letsencrypt.acme.storage=/traefik/acme.json'
```

- **Quitar** las líneas de `httpchallenge` (`...httpchallenge=true` y
  `...httpchallenge.entrypoint=http`) **si están**.
- **Save → Restart Proxy** y revisar **Proxy → Logs**: sin errores del proveedor.

> ⚠️ **No renombrar ni reemplazar el resolver** (`letsencrypt` u otro) si lo
> comparten otras aplicaciones del server: se conserva el resolver compartido
> para no invalidar certificados existentes.

## 4. Coolify — certificado wildcard (dynamic configuration)

**Proxy → Dynamic Configurations** → crear `wildcard-<dominio>.yaml`:

```yaml
http:
  routers:
    wildcard-<dominio>:
      rule: 'HostRegexp(`[a-z0-9-]+\.<dominio-con-puntos-escapeados>`)'
      entryPoints:
        - https
      priority: 1
      service: wildcard-placeholder
      tls:
        certResolver: letsencrypt
        domains:
          - main: <dominio>
            sans:
              - '*.<dominio>'

  services:
    wildcard-placeholder:
      loadBalancer:
        servers: []
```

- **Save** (no requiere reiniciar Traefik).
- **Proxy → Logs**: esperar el pedido ACME OK del certificado `<dominio>` + `*.<dominio>`.
  - Si el resolver no se llama `letsencrypt` en ese server, usar el nombre real.
  - Si aparece **rate limit** de Let’s Encrypt: esperar; no reintentar en loop.

## 5. Ruteo de todos los subdominios a la app

> **Key learning (Coolify):** el ajuste **Domains** de la app **no admite
> wildcards**. Se resuelve con un **router dinámico seguro** en *Dynamic
> Configurations*, sin tocar los labels de la aplicación.

Crear otro router dinámico (o sumar el existente) que capture los subdominios y
los envíe al **service real de la app** (el mismo que usa el router de
`app.<dominio>`; el nombre se copia de la configuración del proxy):

```yaml
http:
  routers:
    tenants-<dominio>:
      rule: 'HostRegexp(`[a-z0-9-]+\.<dominio-escapeado>`)'
      entryPoints:
        - https
      priority: 10
      service: <service-de-la-app>
      tls:
        certResolver: letsencrypt
```

- Conservar el resto de routers/labels **tal como están** (apex y hosts de plataforma no cambian).
- Alternativa equivalente si se prefiere editar labels: agregar
  `HostRegexp(\`[a-z0-9-]+\.<dominio>\`)` a la regla del router HTTPS existente
  (con `Readonly labels` apagado; si algo queda inalcanzable: *Reset Labels to
  Defaults* → reactivar Readonly → Redeploy).

## 6. Verificación

```sh
dig +short <slug>.<dominio> A                                   # IPs de Cloudflare o del server

curl -sS -o /dev/null -w '%{http_code} %{ssl_verify_result}\n' \
  https://<slug>.<dominio>/                                     # 200 0 (sin 525/526/502)

echo | openssl s_client -connect <slug>.<dominio>:443 \
  -servername <slug>.<dominio> 2>/dev/null \
  | openssl x509 -noout -subject -ext subjectAltName            # SAN con *.<dominio>
```

- Probar **dos subdominios distintos** (el comodín rutea más de un tenant).
- Confirmar que `app`, `clientes`, `demo` y el apex siguen respondiendo como antes.

## Troubleshooting

| Síntoma | Causa probable | Acción |
| --- | --- | --- |
| 525/526 en el subdominio | Full (strict) y el origen sin cert válido para el host | Revisar Proxy → Logs (ACME); confirmar el paso 4 y Full (strict) |
| 503 | Router dinámico sin `service` válido | Corregir el `service` (nombre real de la app) o Reset Labels + Redeploy |
| Certificado con otro nombre | SNI/SAN o caché | Repetir `openssl s_client`; limpiar caché del navegador |
| `dig` sin respuesta | Propagación o registro ausente | `dig @1.1.1.1 +short <slug>.<dominio>`; revisar el `*` |
| ACME con rate limit | Demasiados reintentos | Esperar; no borrar `acme.json` a ciegas |
| No aplica a `www.<slug>.<dominio>` | Es segundo nivel | Esperado: soportado solo el host plano |

## Rollback

- **Cloudflare**: borrar el registro `*` — los específicos quedan intactos.
- **Coolify**: borrar los routers dinámicos del wildcard y, si se editó, *Reset
  Labels to Defaults* → reactivar **Readonly labels** → **Redeploy**.
- **Traefik (opcional)**: quitar `CF_DNS_API_TOKEN` y volver a `httpchallenge`.
  El certificado wildcard puede quedar en `acme.json`; no rompe nada.
- **App**: sin cambios de código, env ni datos que revertir (el ruteo por host
  depende solo de DNS/certificado + la resolución del tenant en el middleware).

## Referencias

- Cloudflare — wildcard DNS: <https://developers.cloudflare.com/dns/manage-dns-records/reference/wildcard-dns-records/>
- Cloudflare — Universal SSL (cobertura de primer nivel): <https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/limitations/>
- Coolify — DNS challenge en Traefik: <https://coolify.io/docs/core/networking/proxy/traefik/dns-challenge>
- Coolify — certificados wildcard: <https://coolify.io/docs/core/networking/proxy/traefik/wildcard-certs>
- Caso real verificado: Agendese (`*.agendese.online`; micrositio por empresa en `/` + área de cliente en `/cliente`; apex/app/clientes/demo 200).
