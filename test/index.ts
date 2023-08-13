import { deepStrictEqual, strictEqual } from 'node:assert'
import { describe, it } from 'node:test'
import { defineUnPDFConfig, extractPDFText, getPDFMeta } from '../src/index.node'
import { getPDF } from './utils'

describe('unpdf', () => {
  it('extracts text from a PDF', async () => {
    const { text, totalPages } = await extractPDFText(await getPDF())

    strictEqual(text[0], 'Dummy PDF file')
    strictEqual(totalPages, 1)
  })

  it('extracts metadata from a PDF', async () => {
    const { info, metadata } = await getPDFMeta(await getPDF())

    strictEqual(Object.keys(metadata).length, 0)
    deepStrictEqual(info, {
      PDFFormatVersion: '1.4',
      Language: null,
      EncryptFilterName: null,
      IsLinearized: false,
      IsAcroFormPresent: false,
      IsXFAPresent: false,
      IsCollectionPresent: false,
      IsSignaturesPresent: false,
      Author: 'Evangelos Vlachogiannis',
      Creator: 'Writer',
      Producer: 'OpenOffice.org 2.1',
      CreationDate: 'D:20070223175637+02\'00\'',
    })
  })

  it('can use a custom PDF.js module', async () => {
    await defineUnPDFConfig({
      pdfjs: () => import('pdfjs-dist/legacy/build/pdf.js'),
    })
    const { text } = await extractPDFText(await getPDF())

    strictEqual(text[0], 'Dummy PDF file')
  })
})
