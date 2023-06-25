export const metadata = {
  title: 'Creativa',
  description: 'Discover remarkable developer projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        Navbar
        <main>
          {children}
        </main>
        Footer
      </body>
    </html>
  )
}
