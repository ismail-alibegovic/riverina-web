declare module '@/lib/admin/app.js' {
  export function mount(root: HTMLElement, sb: unknown, cfg: { mediaUrl: (p?: string | null) => string; defaultPage?: unknown; defaultFloors?: unknown }): void;
}
