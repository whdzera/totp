desc "Run Jekyll, Vite and Tailwind CSS in development mode" 
task :dev do
  sh("npx @tailwindcss/cli -i ./app/assets/stylesheets/tailwind.css -o ./app/assets/stylesheets/application.css")

  tailwind_pid = spawn("npx @tailwindcss/cli -i ./app/assets/stylesheets/tailwind.css -o ./app/assets/stylesheets/application.css --watch")
  vite_pid = spawn("npx vite")
  jekyll_pid = spawn("bundle exec jekyll serve")

  Process.wait(tailwind_pid)
  Process.wait(vite_pid)
  Process.wait(jekyll_pid)
end