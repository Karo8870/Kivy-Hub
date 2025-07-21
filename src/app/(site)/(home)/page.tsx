import { KivyButton } from '@/components/buttons/kivy-button';
import { HeroCard } from '@/components/cards/hero-card';
import { Sparkles } from 'lucide-react';
import { HandRecognitionDemo } from '@/components/demo/hand-recognition-demo';
import { LearnButton } from '@/components/buttons/learn-button';

export default function Home() {
  return (
    <main className='flex w-dvw flex-col items-center pb-40'>
      <img
        src='/hero-bg.png'
        alt='hero background'
        className='absolute top-0 left-0 z-10 min-w-dvw'
      />
      <section className='z-10 flex h-dvh flex-col items-center'>
        <h1 className='pt-80 text-8xl font-bold text-white'>Kivy</h1>
        <h2 className='max-w-[460px] pt-20 text-center text-5xl font-semibold text-white/80'>
          The <label className='text-[#FF5BB8]/80'>future</label> of{' '}
          <label className='text-[#5B66FF]/80'>cooking</label> starts here
        </h2>
        <div className='flex items-center gap-6 pt-9'>
          <KivyButton href='/playground'>Start cooking</KivyButton>
          <LearnButton className='w-40'>Learn more</LearnButton>
        </div>
      </section>
      <section className='z-20 flex items-center justify-between gap-10 px-32'>
        <HeroCard
          title='AI Advancements'
          icon={<Sparkles className='text-[#FF5BB8]' />}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea
        </HeroCard>
        <HeroCard
          title='AI Advancements'
          icon={<Sparkles className='text-[#FF5BB8]' />}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea
        </HeroCard>
        <HeroCard
          title='AI Advancements'
          icon={<Sparkles className='text-[#FF5BB8]' />}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea
        </HeroCard>
      </section>
      <section className='sticky top-10 z-0 flex h-[200dvh] w-full justify-between bg-black px-32 pt-72'>
        <div className='flex max-w-min flex-col gap-2'>
          <h1 className='min-w-max text-6xl font-bold text-white'>
            Interactive Widgets
          </h1>
          <p className='text-xl text-white/60'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea
          </p>
          <HandRecognitionDemo />
        </div>
        <div>placeholder for interactive widgets</div>
      </section>
      <LearnButton>Learn more about the hardware</LearnButton>
      <section className='z-10 flex flex-col items-center pt-20'>
        <h1 className='min-w-max text-6xl font-bold text-white'>
          Recipe Autoencoder
        </h1>
        <h2 className='bg-[linear-gradient(90deg,rgba(255,255,255,0.8)_0%,rgba(153,153,153,0.8)_99.64%)] bg-clip-text pt-4 text-5xl font-semibold text-transparent'>
          The best recipe encoder
        </h2>
        <div className='flex flex-col items-center pt-32'>
          <label className='text-2xl text-white/60'>Trained on</label>
          <h3 className='text-5xl font-semibold text-white'>
            2.500.000 Million Recipes
          </h3>
        </div>
        <div className='flex flex-col items-center pt-32'>
          <label className='text-2xl text-white/60'>Made of</label>
          <h3 className='text-5xl font-semibold text-white'>600.000 Params</h3>
        </div>
      </section>
      <LearnButton className='mt-20'>
        Learn more about the autoencoder
      </LearnButton>
    </main>
  );
}
