  desc "Generate a new layout file. Usage: rake layout[name]"
  task :layout, [:name] do |t, args|
    abort "Please provide a name. Usage: rake layout[name]" unless args[:name]

    layout_dir  = "_layouts"
    file_path   = File.join(layout_dir, "#{args[:name]}.html")

    FileUtils.mkdir_p(layout_dir)

    if File.exist?(file_path)
      puts "File already exists: #{file_path}"
    else
      File.write(file_path, <<~HTML)
        ---
        layout: default
        ---
      HTML
      puts "Created #{file_path}"
    end
  end