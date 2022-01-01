<template>
  <div
    class="h-96 w-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex flex-col items-center justify-center mb-8"
  >
    <h1 class="text-6xl md:text-8xl font-bold text-white mb-8 text-center">
      Past paper tracking.
    </h1>
    <p class="font-medium text-3xl md:text-4xl text-white text-center mb-8">
      Made infinitely easier.
    </p>

    <p
      class="bg-white p-2 rounded text-violet-500 font-bold text-center text-xl w-32 cursor-pointer shadow-lg hover:shadow-none hover:-translate-y-[-4px] transition-all"
    >
      <router-link to="/auth/login">Get Started</router-link>
    </p>
  </div>
  <main class="w-4/5 md:w-2/3 mx-auto grid grid-cols-1 gap-8 mb-8">
    <div class="mx-2 rounded bg-red-400 p-4">
      <p class="font-medium text-center text-white">
        wRight is still in beta, so new users can't sign up at the moment.
      </p>
    </div>

    <section>
      <h2 class="text-2xl font-semibold text-violet-600 mb-4">
        What is wRight?
      </h2>
      <p>
        wRight was made for Cambridge A Level students, by a Cambridge A Level
        student. It's designed to help you track which past papers you've
        attempted for practice easily and in a single place, so you can manage
        your revision effortlessly - with all the effort that A Levels demand,
        you're definitely going to be happy that you can take this off your
        mind.
      </p>
    </section>
    <section>
      <h2 class="text-2xl font-semibold text-violet-600 mb-4">
        Is wRight free?
      </h2>
      <p>
        wRight is not only free, but also open source! Check out the source code
        on
        <a
          class="text-violet-600 underline hover:decoration-wavy font-semibold"
          rel="noopener noreferrer"
          href="https://www.github.com/scientist27/past-papers"
          >GitHub.</a
        >
      </p>
    </section>
  </main>
</template>
