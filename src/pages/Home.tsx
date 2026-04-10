import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/config';
import { 
  ExternalLink, 
  Github, 
  Twitter, 
  MessageSquare,
  ChevronDown,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { getProjects, submitInquiry } from '@/lib/firebase-utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const unsub = getProjects((data) => {
      if (data.length > 0) {
        setProjects(data);
      } else {
        // Fallback to config if DB is empty
        setProjects(CONFIG.projects);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen">
      <Hero />
      <About />
      <Skills />
      <ProjectsSection projects={projects} />
      <Contact />
    </div>
  );
}

function Hero() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-amber-500/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge text={`${CONFIG.age} Year Old Developer`} />
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
            {CONFIG.name.toUpperCase()}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            {CONFIG.tagline}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={scrollToProjects} size="lg" className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-8 rounded-full">
              View Projects
            </Button>
            <Button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} size="lg" variant="outline" className="border-zinc-800 hover:bg-zinc-900 rounded-full px-8">
              Contact Me
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500"
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}

function About() {
  return (
    <section className="py-32 container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Over <span className="text-amber-500">{CONFIG.experience}</span> of crafting digital experiences.
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed mb-8">
            {CONFIG.about}
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">50+</h4>
              <p className="text-zinc-500 uppercase text-xs tracking-widest font-bold">Servers Managed</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-white mb-1">10k+</h4>
              <p className="text-zinc-500 uppercase text-xs tracking-widest font-bold">Players Reached</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50 p-1"
        >
          <img 
            src="https://picsum.photos/seed/hashim/800/800" 
            alt="Hashim" 
            className="w-full h-full object-cover rounded-[22px] grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-32 bg-zinc-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Technical Arsenal</h2>
          <p className="text-zinc-500">The tools and technologies I use to bring ideas to life.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONFIG.skills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{skill.name}</h3>
                <span className="text-amber-500 font-mono">{skill.level}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-amber-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ projects }: { projects: any[] }) {
  return (
    <section id="projects" className="py-32 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Selected Works</h2>
          <p className="text-zinc-500">A collection of servers and systems I've developed.</p>
        </div>
        <Button variant="link" className="text-amber-500 p-0 h-auto text-lg hover:no-underline group">
          View all projects <ChevronDown size={20} className="-rotate-90 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {projects.map((project, i) => (
          <motion.div
            key={project.id || i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-zinc-800">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="outline" className="rounded-full border-white text-white hover:bg-white hover:text-zinc-950">
                  <ExternalLink size={18} className="mr-2" /> Case Study
                </Button>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              {project.tags.map((tag: string, j: number) => (
                <span key={j} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-500 transition-colors">{project.title}</h3>
            <p className="text-zinc-400 leading-relaxed">{project.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitInquiry(form);
      toast.success("Message sent! Hashim will get back to you soon.");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 container mx-auto px-4">
      <div className="bg-amber-500 rounded-[40px] p-8 md:p-24 text-zinc-950 flex flex-col lg:flex-row items-center justify-between gap-16 overflow-hidden relative">
        <div className="relative z-10 lg:w-1/2">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
            LET'S BUILD SOMETHING GREAT.
          </h2>
          <div className="flex flex-wrap gap-4 mb-12">
            <div className="flex gap-2">
              <SocialBtn icon={<Github size={20} />} href={CONFIG.socials.github} />
              <SocialBtn icon={<Twitter size={20} />} href={CONFIG.socials.twitter} />
              <SocialBtn icon={<MessageSquare size={20} />} href={CONFIG.socials.discord} />
            </div>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-60">Based in</p>
            <p className="text-2xl font-bold">The Digital World</p>
          </div>
        </div>

        <div className="relative z-10 w-full lg:w-1/2 bg-zinc-950/10 backdrop-blur-md p-8 rounded-3xl border border-zinc-950/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input 
                required
                placeholder="Your Name" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="bg-zinc-950/20 border-zinc-950/30 placeholder:text-zinc-950/50 text-zinc-950 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Input 
                required
                type="email"
                placeholder="Your Email" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="bg-zinc-950/20 border-zinc-950/30 placeholder:text-zinc-950/50 text-zinc-950 font-medium"
              />
            </div>
            <div className="space-y-2">
              <Textarea 
                required
                placeholder="Your Message" 
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                className="bg-zinc-950/20 border-zinc-950/30 placeholder:text-zinc-950/50 text-zinc-950 font-medium min-h-[120px]"
              />
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-zinc-950 text-white hover:bg-zinc-900 rounded-full py-6 font-bold text-lg"
            >
              {loading ? "Sending..." : <><Send size={20} className="mr-2" /> Send Message</>}
            </Button>
          </form>
        </div>
        
        {/* Decorative background text */}
        <div className="absolute -bottom-10 -right-10 text-[200px] font-black opacity-10 select-none pointer-events-none leading-none">
          HELLO
        </div>
      </div>
    </section>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
      <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{text}</span>
    </div>
  );
}

function SocialBtn({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className="w-12 h-12 rounded-full bg-zinc-950/10 border border-zinc-950/20 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all"
    >
      {icon}
    </a>
  );
}
