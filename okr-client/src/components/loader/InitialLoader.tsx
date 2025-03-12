import { Bot, Goal, LoaderCircle, Milestone } from 'lucide-react';

export default function InitialLoader() {
  return (
    <section className="relative w-screen h-screen flex flex-col justify-center gap-y-32 items-center">
      <SurroundingIcons />
      <GoalCraftBanner />
      <BouncingLoader />
      <PoweredByIncubyte />
    </section>
  );
}

const SurroundingIcons = () => {
  return (
    <>
      <Goal className="absolute left-44 top-44 text-primary" />
      <Milestone className="absolute right-44 top-44 text-secondary" />
      <Milestone className="absolute left-72 bottom-60 text-secondary" />
      <Goal className="absolute right-72 bottom-60 text-primary" />
    </>
  );
};

const GoalCraftBanner = () => {
  return (
    <div className="relative text-center">
      <div className="absolute right-0 -top-20 bg-gray-800 text-white rounded-full px-3 py-2 text-sm">
        <p className="flex gap-x-2 items-center font-medium">
          <Bot className="w-5 h-5" /> <span>AI Integrated</span>
        </p>
      </div>
      <h1 className="text-3xl font-medium mb-2">
        <span className="text-primary">Goal</span>Craft -
        <span className="text-secondary">Your path to achievement</span>
      </h1>
      <p className="text-gray-700 text-base font-medium">
        The most intuitive platform to streamline your goals, objectives, and key results.
      </p>
    </div>
  );
};

const BouncingLoader = () => {
  return (
    <div className="animate-bounce">
      <p className="m-auto text-lg text-gray-500 font-medium flex items-center justify-center">
        <LoaderCircle className="animate-spin mr-2" /> Fetching your data...
      </p>
    </div>
  );
};

const PoweredByIncubyte = () => {
  return (
    <div className="absolute bottom-16">
      <p className="flex gap-x-1 items-center text-base font-medium">
        Powered by{' '}
        <img
          width={90}
          src="https://cdn.prod.website-files.com/6626410e05635d300b393781/6626470cbc8d6debaaa5adeb_Incubyte%20Logo.svg"
          alt="incubyte"
        />
      </p>
    </div>
  );
};
