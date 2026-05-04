import { modernTemplate } from './modern';

export const templates = [modernTemplate];

export function getTemplate(id: string) {
  return templates.find((t) => t.id === id) ?? modernTemplate;
}
