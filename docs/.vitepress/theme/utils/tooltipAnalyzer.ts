#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface TooltipStats {
  totalFiles: number
  totalCodeBlocks: number
  byLanguage: Map<string, number>
  byFile: Map<string, { blocks: number; languages: Set<string> }>
}

async function* walkFiles(dir: string): AsyncGenerator<string> {
  const files = await readdir(dir, { withFileTypes: true })
  for (const file of files) {
    const path = join(dir, file.name)
    if (file.isDirectory()) {
      yield* walkFiles(path)
    } else if (extname(file.name) === '.md') {
      yield path
    }
  }
}

async function analyzeTooltips() {
  const stats: TooltipStats = {
    totalFiles: 0,
    totalCodeBlocks: 0,
    byLanguage: new Map(),
    byFile: new Map()
  }

  const docsDir = join(__dirname, '../../../')
  
  console.log('\nAnalyzing code blocks with tooltips...\n')

  try {
    for await (const file of walkFiles(docsDir)) {
      const content = await readFile(file, 'utf-8')
      
      // Look for code blocks within tooltip containers
      const tooltipBlocks = content.match(/:::[\s]*code-with-tooltips[\s\S]*?```(\w+)[\s\S]*?```[\s\S]*?:::/g) || []
      
      if (tooltipBlocks.length > 0) {
        const relativePath = file.replace(docsDir, '')
        stats.totalFiles++
        stats.totalCodeBlocks += tooltipBlocks.length
        
        const languages = new Set<string>()
        
        tooltipBlocks.forEach(block => {
          const langMatch = block.match(/```(\w+)/)
          if (langMatch) {
            const lang = langMatch[1]
            languages.add(lang)
            stats.byLanguage.set(lang, (stats.byLanguage.get(lang) || 0) + 1)
          }
        })
        
        stats.byFile.set(relativePath, {
          blocks: tooltipBlocks.length,
          languages
        })
      }
    }

    // Output results
    console.log('=== Tooltip Analysis ===\n')
    console.table({
      'Total Files with Tooltips': stats.totalFiles,
      'Total Code Blocks': stats.totalCodeBlocks
    })

    if (stats.byLanguage.size > 0) {
      console.log('\n=== Code Blocks by Language ===\n')
      console.table(Object.fromEntries(stats.byLanguage))
    }

    const topFiles = Array.from(stats.byFile.entries())
      .sort(([, a], [, b]) => b.blocks - a.blocks)
      .slice(0, 5)
      .map(([file, data]) => ({
        file,
        blocks: data.blocks,
        languages: Array.from(data.languages).join(', ')
      }))

    console.log('\n=== Top Files by Code Block Count ===\n')
    console.table(topFiles)

  } catch (err) {
    console.error('Failed to analyze tooltips:', err)
  }
}

analyzeTooltips()