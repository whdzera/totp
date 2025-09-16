## TOTP

### About

A lightweight client-side web application for managing TOTP (Time-Based One-Time Password) codes — similar to Google Authenticator.

### Prerequisites

- Ruby 3.0^
- Node 2.2^

## Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/spellbooks/jekyll-boilerplate.git
cd jekyll-boilerplate
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

#### 5. Generate html Layout

```bash
rake layout[test]
```

make new file 'test.html in `_layouts`

#### 6. Generate Controller Stimulus

```bash
rake stimulus[test]
```

make new file 'test_controller.js in `app/javascript/controllers`

added import and register test controller in `app/javascript/application.js`

#### 7. Build js using vite

```bash
rake build
```

file build in `app/build/application.js`

#### 8. Run Jekyll Production Sever

```bash
rake p
```

### Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit them: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Create a pull request.
