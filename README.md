# car-rental-website
Dynamic car-rental web app with AJAX search, JSON persistence &amp; AWS Elastic Beanstalk deploy

# Car-Rental-Site

> “Rent the ride you want, when you want it – all from your browser.”

Hi! I’m **Avaneesha** and this is the full-stack web app I built for my AUT 2025 assignment.  
I wanted the site to feel like a real-world product, so it goes beyond static pages and actually **stores car data, lets you reserve a vehicle, and confirms the booking – all live on AWS (expired now).**



---

## Why I built it

1. **Real-life use-case.** Friends kept joking that booking a car online still feels stuck in 2010. Challenge accepted!  
2. **Hands-on learning.** I’d never connected a JSON datastore to a jQuery front-end before – now I have.  
3. **Cloud deployment practice.** Elastic Beanstalk handles the boring ops so I could focus on features.

---

## Under the bonnet

| Layer          | What I used & why                     |
| -------------- | ------------------------------------- |
| Front-end UI   | HTML, CSS, vanilla JS + jQuery (for painless AJAX) |
| Server         | **Express / Node.js** – tiny, fast, deploys easily to EB |
| Persistence    | Two JSON files (`cars.json`, `orders.json`) – lightweight for a student project |
| Hosting        | AWS Elastic Beanstalk, single t2.micro instance |

---

## Core features

-  **Instant search** with live suggestions  
-  **Filter** by brand or type (SUV, Sedan, …)  
-  **Detail pages** with photos, mileage, fuel type & price  
-  **Reservation flow** with form auto-save if you wander off  
-  **Click-to-confirm email link** that flips status from *pending* to *confirmed*  
-  *Graceful error handling** (no more silent fails)

---

## Getting started locally

```bash
git clone https://github.com/<your-user>/car-rental-site.git
cd car-rental-site
npm install              # pulls dependencies
npm start                # launches on http://localhost:3000
