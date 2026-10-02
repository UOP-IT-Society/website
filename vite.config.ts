import { defineConfig, type Plugin } from 'vite'
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import fs from "fs";
import { globSync } from 'glob';
import { marked } from 'marked';


// Something horrible to get the icons to work
function scannedIconsPlugin() {
  const virtualModuleId = 'virtual:scanned-icons';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'vite-plugin-scanned-icons',
    
    resolveId(id: string) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },

    load(id: string) {
      if (id !== resolvedVirtualModuleId) return null;

      const files = globSync('**/*.{ts,js,html}', {ignore: ["node_modules/**", "dist/**"]});
      const foundIcons = new Set<string>();

      const regex = /iconName=["']([^"']+)["']/g;

      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        let match;
        while ((match = regex.exec(content)) !== null) {
          foundIcons.add(match[1]);
        }
      });

      // Generate imports
      let imports = '';
      let registryEntries = '';

      Array.from(foundIcons).forEach((icon, index) => {
        if (icon.startsWith('it-')) {
          // IT Society icons
          imports += `import icon_${index} from '/static/icons/${icon}.png?url';\n`;
          registryEntries += `  "${icon}": { type: "png", source: icon_${index} },\n`;
        } else {
          // pixelarticons
          imports += `import icon_${index} from 'pixelarticons/svg/${icon}.svg?raw';\n`;
          registryEntries += `  "${icon}": { type: "svg", source: icon_${index} },\n`;
        }
      });

      return `
        ${imports}
        export const scannedRegistry = {
          ${registryEntries}
        };
      `;
    }
  };
}

function inlineMarkdown(): Plugin {
  const re = /<!--\s*md:\s*(\S+?)\s*-->/g

  return {
    name: "inline-markdown",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        return html.replace(re, (_, file: string) => {
          const abs = resolve(dirname(ctx.filename), file)
          const content = readFileSync(abs, "utf-8")
          return marked.parse(content, {async: false})
        })
      }
    },
    configureServer(server) {
      server.watcher.on("change", (f) => {
        if (f.endsWith(".md")) {
          server.ws.send({type: "full-reload"})
        }
      })
    }
  }

}


export default defineConfig({
  plugins: [scannedIconsPlugin(), inlineMarkdown()],
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        lectures: resolve(import.meta.dirname, 'lectures/index.html'),
        links: resolve(import.meta.dirname, 'links/index.html'),
      },
    },
  },
})