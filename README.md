# Jekyll Starter

A clean boilerplate to kickstart client-side sites using **Jekyll**, **Vite**, **Stimulus.js**, and **Tailwind CSS**.  
Ideal for blogs, documentation sites, personal landing pages or portfolio.

I built this template to make Jekyll competitive with Astro.

Jekyll using version `4.4.1`

Stimulus configuration `app/javascript/application.js`
Stimulus controllers are located in `app/javascript/controllers/**`

Tailwind input `app/assets/stylesheets/tailwind.css`
Tailwind builds to `app/assets/stylesheets/application.css`

- [Jekyll](https://jekyllrb.com/)
- [Vite](https://vite.dev/)
- [Stimulus.js](https://stimulus.hotwired.dev/)
- [Tailwind CSS](https://tailwindcss.com/) 

---

## Structure

<img src="https://i.imgur.com/aukHSw4.png">

## Prerequisites
- Ruby 3.0^
- Node 2.2^

## Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/spellbooks/jekyll-template-starter.git
cd jekyll-template-starter
```

#### 2. Install Dependencies
```bash
bundle install && npm install
```

#### 3. Run Jekyll Development Server
```bash
rake dev
```
the command running jekyll, vite and tailwindcss

open `localhost:4000`

#### 4. Run Rspec Testing
```bash
rake test
```

#### 5. Generate Controller Stimulus
`hello is example`
```bash
rake stimulus[hello]
```
make new file 'hello_controller.js in `app/javascript/controllers`

added import and register hello controller in `app/javascript/application.js`

#### 6. Build js using vite
```bash
rake build
```
file build in `app/build/application.js` 

#### 7. Run Jekyll Production Sever
```bash
rake p
```

## Gists

Automation Generate new Project jekyll use this template

https://gist.github.com/whdzera/aefad9ae560df32adfb7848e0bad28f2

## License

MIT License

#### Credits

Created by `whdzera`

Feel free to fork, improve, or contribute via pull requests!