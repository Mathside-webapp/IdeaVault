const paths = {
'check-square':'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/>',
'lightbulb':'<path d="M9 18h6m-5 4h4M7.5 14.5C5.8 13.2 5 11.5 5 9.5a7 7 0 0 1 14 0c0 2-.8 3.7-2.5 5-1 1-1.5 2.3-1.5 3.5h-6c0-1.2-.5-2.5-1.5-3.5z"/>',
'search':'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
'archive':'<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/>',
'settings':'<path d="M10 2h4l.7 2.5 1.8.8 2.3-1.2 2.7 3-1.5 2.1.3 2 2.2 1.4-.9 3.9-2.7.2-1.3 1.6.5 2.6-3.6 1.5-1.9-1.9-2 .1-1.7 1.9-3.6-1.6.5-2.7-1.4-1.4-2.6-.1-.9-3.8 2.1-1.5.4-2L2.9 7l2.7-3 2.4 1.2 1.7-.8z"/><circle cx="12" cy="12" r="3"/>',
'shield-check':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
'sparkles':'<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3zM19 18l.7 1.3L21 20l-1.3.7L19 22l-.7-1.3L17 20l1.3-.7z"/>',
'circle-help':'<circle cx="12" cy="12" r="10"/><path d="M9.5 9a3 3 0 1 1 4 2.8c-1 .5-1.5 1.2-1.5 2.2"/><path d="M12 17h.01"/>',
'mouse-pointer-2':'<path d="m5 3 14 9-7 1-3 7z"/>',
'hand':'<path d="M9 11V4a2 2 0 0 1 4 0v6-4a2 2 0 0 1 4 0v5-2a2 2 0 0 1 4 0v5c0 5-3 8-8 8h-2c-3 0-5-2-7-6l-2-3c-1-2 1-4 3-3z"/>',
'git-branch':'<circle cx="6" cy="4" r="2"/><circle cx="18" cy="7" r="2"/><circle cx="6" cy="20" r="2"/><path d="M6 6v12m0-6c0-3 3-5 10-5"/>',
'image-down':'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="2"/><path d="m3 18 6-6 4 4 2-2 6 6M12 7v7m-3-3 3 3 3-3"/>',
'plus':'<path d="M12 5v14M5 12h14"/>','minus':'<path d="M5 12h14"/>',
'ellipsis':'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
'sticky-note':'<path d="M4 3h16v12l-5 6H4z"/><path d="M15 21v-6h5"/>',
'move-up-right':'<path d="M7 17 17 7m-8 0h8v8"/>',
'edit-3':'<path d="M12 20H4v-8L15 1l8 8-11 11zM13 3l8 8"/>',
'check':'<path d="m4 12 5 5L20 6"/>','x':'<path d="M5 5 19 19M19 5 5 19"/>',
'copy':'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
'lock':'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
'unlock':'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7-3"/>',
'pin':'<path d="m9 3 12 12-3 1-4 4-1 3-5-5-5-5 3-1 4-4zM3 21l6-6"/>',
'calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
'clock':'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
'paperclip':'<path d="m21 11-8 8a6 6 0 0 1-8-8L13 3a4 4 0 0 1 6 6l-8 8a2 2 0 0 1-3-3l7-7"/>',
'link':'<path d="M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 1 0 7 7l2-2"/>',
'undo-2':'<path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-2"/>',
'redo-2':'<path d="m15 14 5-5-5-5m5 5H10a6 6 0 0 0 0 12h2"/>',
'download':'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
'upload':'<path d="M12 21V9m-4 4 4-4 4 4M4 8V3h16v5"/>',
'trash-2':'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
'rotate-ccw':'<path d="M3 11a9 9 0 1 0 3-6L3 8V3m0 5h5"/>',
'info':'<circle cx="12" cy="12" r="10"/><path d="M12 11v6m0-10h.01"/>',
'filter':'<path d="M3 5h18M6 12h12M9 19h6"/>',
'external-link':'<path d="M13 4h7v7M20 4l-9 9M20 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"/>',
'chevron-right':'<path d="m9 5 7 7-7 7"/>','arrow-left':'<path d="M20 12H4m6-6-6 6 6 6"/>',
'check-circle':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
'more-vertical':'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
'file':'<path d="M5 3h10l5 5v13H5zM15 3v5h5"/>',
'palette':'<circle cx="12" cy="12" r="10"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="6.5" r="1"/><circle cx="16" cy="8" r="1"/><path d="M17 13a2 2 0 0 0-2 2c0 2 2 2 2 4"/>',
'sun':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
'moon':'<path d="M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13z"/>',
'grip':'<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>'
, 'square-dashed':'<path d="M7 3h3m4 0h3m4 4v3m0 4v3m-4 4h-3m-4 0H7m-4-4v-3m0-4V7m4-4H5a2 2 0 0 0-2 2v2m18 10v2a2 2 0 0 1-2 2h-2"/>'
, 'move-diagonal-2':'<path d="M5 19 19 5M12 5h7v7M5 12v7h7"/>'
, 'eye':'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>'
, 'file-text':'<path d="M5 3h10l5 5v13H5zM15 3v5h5M8 12h8M8 16h8"/>'
, 'sliders-horizontal':'<path d="M3 7h18M3 17h18"/><circle cx="9" cy="7" r="3" fill="white"/><circle cx="15" cy="17" r="3" fill="white"/>'
, 'book-open':'<path d="M12 7c-4-2-7-2-10-1v14c3-1 6-1 10 1 4-2 7-2 10-1V6c-3-1-6-1-10 1zM12 7v14"/>'
, 'bold':'<path d="M6 4h6a4 4 0 0 1 0 8H6zM6 12h7a4 4 0 0 1 0 8H6z"/>'
, 'italic':'<path d="M10 4h10M4 20h10M15 4 9 20"/>'
, 'underline':'<path d="M5 4v8a7 7 0 0 0 14 0V4M4 21h16"/>'
, 'eraser':'<path d="m14 3 7 7-10 11H6l-4-4zM8 14l6 6M11 21h11"/>'
, 'list-checks':'<path d="m3 5 2 2 3-3M11 6h10M3 13l2 2 3-3M11 14h10M3 21l2-2 3 2M11 21h10"/>',
'circle-dot':'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
'type':'<path d="M4 7V4h16v3M12 4v16m-4 0h8"/>',
'chevron-left':'<path d="m15 5-7 7 7 7"/>'
};
export function ico(name, size=19) { return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.info}</svg>`; }
export function injectIcons(root=document) { root.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = ico(el.dataset.icon); }); }
