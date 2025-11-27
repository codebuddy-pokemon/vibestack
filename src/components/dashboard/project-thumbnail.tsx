"use client"

import React, { useEffect, useRef } from "react"

interface ProjectThumbnailProps {
    html: string
    css: string
    title: string
}

export function ProjectThumbnail({ html, css, title }: ProjectThumbnailProps) {
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
                body { overflow: hidden; } /* Prevent scrolling in thumbnail */
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
        <div className="w-full h-full bg-white overflow-hidden relative pointer-events-none">
            <iframe
                ref={iframeRef}
                title={`Preview of ${title}`}
                className="w-[1280px] h-[720px] border-0 origin-top-left transform scale-[0.25]"
                style={{ width: "400%", height: "400%" }} // Scale logic: 100% / 0.25 = 400%
                sandbox="allow-scripts"
                loading="lazy"
            />
            {/* Overlay to prevent interaction and add hover effect */}
            <div className="absolute inset-0 bg-transparent" />
        </div>
    )
}
