"use client"

import React, { useEffect, useRef } from "react"

interface PreviewProps {
  html: string
  css: string
}

export function Preview({ html, css }: PreviewProps) {
  const srcDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${css}
            body { 
                min-height: 100vh;
                background-color: white; /* Default background */
            } 
          </style>
          <script src="https://cdn.tailwindcss.com"></script>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        </head>
        <body>
          ${html}
        </body>
      </html>
    `

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
      <iframe
        srcDoc={srcDoc}
        title="Preview"
        className="w-full h-full border-0"
        sandbox="allow-scripts"
      />
    </div>
  )
}
