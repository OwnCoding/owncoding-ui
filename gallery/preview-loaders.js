// Dynamic imports are intentionally isolated from the metadata-only registry.
export const PREVIEW_LOADERS = {
  'reusable': () => import('./reusable-previews.jsx').then(module => module.ReusablePreview),
  'specialized': () => import('./specialized-previews.jsx').then(module => module.SpecializedPreview),
  'search-board': () => import('./search-board-previews.jsx').then(module => module.SearchBoardPreview),
  'receiving': () => import('./receiving-previews.jsx').then(module => module.ReceivingPreview),
  'document': () => import('./document-previews.jsx').then(module => module.DocumentPreview),
  'review': () => import('./review-previews.jsx').then(module => module.ReviewPreview),
  'shell': () => import('./shell-previews.jsx').then(module => module.ShellPreview),
  'operation': () => import('./operation-previews.jsx').then(module => module.OperationPreview),
}
