require "rspec/core/rake_task"

task :default do
  sh "rake -T"
end

desc "Run Jekyll, Vite and Tailwind CSS --watch" 
task :dev do
  sh("npx @tailwindcss/cli -i ./app/assets/stylesheets/tailwind.css -o ./app/assets/stylesheets/application.css")

  tailwind_pid = spawn("npx @tailwindcss/cli -i ./app/assets/stylesheets/tailwind.css -o ./app/assets/stylesheets/application.css --watch")
  vite_pid = spawn("npx vite")
  jekyll_pid = spawn("bundle exec jekyll serve")

  Process.wait(tailwind_pid)
  Process.wait(vite_pid)
  Process.wait(jekyll_pid)
end

desc "Build Vite"
task :build do
  sh "npx vite build"
end

desc "Generate Stimulus controller"
task :stimulus, [:name] do |t, args|
  abort "Please provide a name. Usage: rake stimulus[Name]" unless args[:name]

  original_name = args[:name]
  controller_name = original_name.downcase.gsub('-', '_')
  class_name = original_name.split(/_|-/).map(&:capitalize).join + "Controller"

  file_path = "app/javascript/controllers/#{controller_name}_controller.js"
  app_js_path = "app/javascript/application.js"

  import_line = "import #{class_name} from \"./controllers/#{controller_name}_controller.js\""
  register_line = "Stimulus.register(\"#{controller_name}\", #{class_name});"

  unless File.exist?(file_path)
    File.write(file_path, <<~JS)
      import { Controller } from "@hotwired/stimulus"

      export default class #{class_name} extends Controller {
        connect() {
          console.log("Hello from #{class_name}")
        }
      }
    JS
    puts "Created: #{file_path}"
  else
    puts "File already exists: #{file_path}"
  end

  if File.exist?(app_js_path)
    app_js = File.read(app_js_path)

    unless app_js.include?(import_line)
      File.open(app_js_path, "a") { |f| f.puts import_line }
      puts "Added import to #{app_js_path}"
    end

    unless app_js.include?(register_line)
      File.open(app_js_path, "a") { |f| f.puts register_line }
      puts "Added registration to #{app_js_path}"
    end
  else
    puts "Could not find #{app_js_path}"
  end
end

desc "Run Jekyll in production mode"
task :p do
  sh "JEKYLL_ENV=production bundle exec jekyll serve"
end

desc "Run RSpec tests"
RSpec::Core::RakeTask.new(:test)