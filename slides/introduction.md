---
marp: true
paginate: true
---

# **Oneservice Hotline v0.1**

Helpful AI assistant to submit cases on municipal issues.

###### First prize winner of GovTech x OpenAI Hackathon 2024
 

![bg right:45% 95%](./images/app.png)

---
## Table of Contents
1. About Us
1. Problem Statement
1. How It Works
1. What Works well?
1. What Doesn't Work?
1. What's Next?


---

# About Us
Group of aspiring young engineers
(left-to-right)

-  [Ong Zheng Kai](https://www.linkedin.com/in/ong-zheng-kai)
-  [Wong Zhao Wu, Bryan](https://www.linkedin.com/in/zw-wong/) (looking for Summer Intern 2025!)
-  [Oh Tien Cheng](https://www.linkedin.com/in/ohtiencheng)
-  [Muhammad Faqih Akmal](https://www.linkedin.com/in/faqih-akmal/)

![bg left](./images/team-pic.jpg)


---

# Problem Statement

How might we enable **elderly users** in submitting **municipal cases or feedback** without requiring them to navigate the OneService App, which can be challenging due to **limited digital literacy**?


---

# OneService App

> The OneService App is a one-stop platform that lets citizens feedback on municipal issues without having to figure out which Government agency or town council to contact.
https://www.smartnation.gov.sg/initiatives/oneservice-app/

![bg right 80%](https://www.oneservice.gov.sg/images/default-source/default-album/homepage-artwork.png?sfvrsn=fab74b4f_1)

---

# How It Works
![w:1100 h:460](./images/architecture.drawio.png)

https://platform.openai.com/docs/guides/realtime

---
# What Works Well?

- GPT-4o **understands Singapore languagues** (*Singlish, English, Mandarin, Hokkien, Teochew, Cantonese*) well enough to submit case reliably.
- GPT-4o orchestrated the workflow with just **25 lines of instruction prompt** (without complex agentic workflow).
- Web Socket and Web-RTC integration is straight-forward and extensible (with the right template).

---

# What Doesn't work?
- VAD is not reliable in loud environment with multiple speakers in background.
- Whisper doesn't work reliably with Singlish (*when different languages mixes*).
- Stateful server interaction of Realtime session with maximum duration 30 minutes.
- Realtime API is costly.

---
# What's Next?
- Integration with the Real OneService API.
- Extend coverage for more OneService case categories.
- More robust functional testing with real user queries.
- Improve VAD model's performance.
- Explore deployment options and costing.
- *Finetune ASR model with local languages. (Hard: Hokkien dont have unified writing system but phonetic ones)

