# OneService Hotline

The OneService Hotline is a helpful artificial intelligence assistant, responsible for helping users (*primarily elderly*) to submit a case or feedback on municipal issues, without having to interact with the OneService App which could be challenging for elderly with limited digital literacy.

<img src="/readme/oneservice-hotline-demo.png" width="800" />

This is also the winning solution for [GovTech x OpenAI Hackathon 2024](https://www.tech.gov.sg/media/events/govtech-openai-hackathon-2024/).

## Starting the console

This is a React project created using `create-react-app` that is bundled via Webpack.
Install it by extracting the contents of this package and using;

```shell
npm i
```

Start your server with:

```shell
npm start
```

It should be available via `localhost:3000`.

## How it works?

The console requires an OpenAI API key (**user key** or **project key**) that has access to the Realtime API.
You'll be prompted on startup to enter it. It will be saved via `localStorage` and can be changed at any time from the UI.

To start a session you'll need to **connect**. This will require microphone access.
You can then choose between **manual** (Push-to-talk) and **vad** (Voice Activity Detection) conversation modes, and switch between them at any time.

The AI assistant will engage with the user to retrieve the reporter's contact information and more details about the case, before submitting the case using [Function Calling](https://platform.openai.com/docs/guides/function-calling).

In our preliminary testing, the [Realtime API](https://platform.openai.com/docs/guides/realtime) can listen and speak multiple commonly available language (*e.g. English, Singlish, Mandarin, Malay, Tamil and other dialects*) seamlessly and interchangeably. However, more rigorous study is required for its actual performance in production setting (given factors like ambience noise, unclear responses, accented audio etc).

The actual system instruction and function defintions used in this demo are available in `src/utils/conversation_config.js` and `src/utils/tools.ts`. Feel free to adapt it for your own hotline use cases.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgement

- [openai-realtime-console](https://github.com/openai/openai-realtime-console)
- Wong Zhao Wu (Bryan) / [LinkedIn](https://www.linkedin.com/in/zw-wong/)
- Muhammad Faqih Akmal / [LinkedIn](https://www.linkedin.com/in/faqih-akmal/)
- Ong Zheng Kai / [LinkedIn](https://www.linkedin.com/in/ong-zheng-kai)
- Oh Tien Cheng / [LinkedIn](https://www.linkedin.com/in/ohtiencheng)
- Matthew Chan / [LinkedIn](https://www.linkedin.com/in/matthew-chan-8905071bb)
