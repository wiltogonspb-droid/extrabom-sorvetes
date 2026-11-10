import './globals.css'
export const metadata={title:'EXTRABOM SORVETES — Área do Revendedor',description:'Sistema de pedidos para revendedores EXTRABOM SORVETES',manifest:'/manifest.webmanifest',themeColor:'#0B3D91'}
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="pt-BR"><head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/><link rel="manifest" href="/manifest.webmanifest"/><link rel="icon" href="/logo.png"/></head><body>{children}</body></html>)}
