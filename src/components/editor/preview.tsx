"use client"

import React, { useEffect, useRef } from "react"

interface PreviewProps {
    html: string
    css: string
}

export function Preview({ html, css }: PreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument
            if (doc) {
                doc.open()
                doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                ${css}
              </style>
              <script src="https://cdn.tailwindcss.com"></script>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
            </head>
            <body>
              ${html}
            </body>
          </html>
        `)
                doc.close()
            }
        }
    }, [html, css])

    return (
        <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
            <iframe
                ref={iframeRef}
                title="Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
            />
        </div>
    )
}
