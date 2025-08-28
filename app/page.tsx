import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const tools = [
    {
      id: 'debate',
      title: 'LLM Debate',
      description: 'Watch two LLMs debate in real time, with a judge delivering a synthesis.',
      image: '/debate-icon.png', // Placeholder image path
      link: '/debate',
      enabled: true
    },
    {
      id: 'chat',
      title: 'AI Chatbot',
      description: 'Engage in intelligent conversations with our advanced AI chatbot.',
      image: '/chat-icon.png', // Placeholder image path
      link: '/chat',
      enabled: false
    },
    {
      id: 'code',
      title: 'Code Assistant',
      description: 'Get help with coding, debugging, and code generation.',
      image: '/code-icon.png', // Placeholder image path
      link: '/code',
      enabled: false
    },
    {
      id: 'image',
      title: 'Image Generator',
      description: 'Create stunning images from text prompts using AI.',
      image: '/image-icon.png', // Placeholder image path
      link: '/image',
      enabled: false
    }
  ]

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">AI Tools Dashboard</h1>
      <p className="text-slate-300 text-center mb-12">Explore and use our suite of AI-powered tools to enhance your productivity.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors">
            <div className="flex justify-center mb-4">
              <Image src={tool.image} alt={tool.title} width={64} height={64} className="rounded-lg" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-center">{tool.title}</h2>
            <p className="text-slate-400 text-sm mb-4 text-center">{tool.description}</p>
            <div className="text-center">
              {tool.enabled ? (
                <Link href={tool.link} className="inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">
                  Start
                </Link>
              ) : (
                <span className="inline-block px-4 py-2 rounded-lg bg-slate-700 text-slate-400">
                  Coming Soon
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}