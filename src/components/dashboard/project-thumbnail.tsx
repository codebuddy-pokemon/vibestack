"use client"

import React, { useEffect, useRef } from "react"

interface ProjectThumbnailProps {
  html: string
  css: string
  title: string
}

export function ProjectThumbnail({ html, css, title }: ProjectThumbnailProps) {
  const srcDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${css}
            body { 
                overflow: hidden; 
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
    <div className="w-full h-full bg-white overflow-hidden relative pointer-events-none">
      <iframe
        srcDoc={srcDoc}
        title={`Preview of ${title}`}
        className="w-[1280px] h-[720px] border-0 origin-top-left transform scale-[0.25]"
        style={{ width: "400%", height: "400%" }}
        sandbox="allow-scripts"
        loading="lazy"
      />
      {/* Overlay to prevent interaction and add hover effect */}
      <div className="absolute inset-0 bg-transparent" />
    </div>
  )
}
