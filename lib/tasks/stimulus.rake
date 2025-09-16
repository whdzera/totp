desc "Generate Stimulus controller"
task :stimulus, [:name] do |t, args|
  abort "Please provide a name. Usage: rake stimulus[Name]" unless args[:name]

  original_name   = args[:name]
  controller_name = original_name.downcase.gsub('-', '_')
  class_name      = original_name.split(/_|-/).map(&:capitalize).join + "Controller"

  file_path = "app/javascript/controllers/#{controller_name}_controller.js"

  if File.exist?(file_path)
    puts "File already exists: #{file_path}"
  else
    File.write(file_path, <<~JS)
      import { Controller } from "@hotwired/stimulus"

      export default class #{class_name} extends Controller {
        connect() {
          console.log("Hello from #{class_name}")
        }
      }
    JS
    puts "Created: #{file_path}"
  end
end