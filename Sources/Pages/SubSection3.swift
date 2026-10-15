import Raptor

struct SubSection3: HTML {
    var body: some HTML {
        Grid {
            GridRow {
                VStack(alignment: .leading) {
                    Text("Bugs and Vulnerabilites")
                        .font(.title1)
                        .fontWeight(.medium)
                    Text("Should you encounter a bug or a vulnerability, please report it on GitHub to help keep Vein stable and secure.")
                        .foregroundStyle(.secondary)
                    HStack {
                        Link("Report a bug", destination: "https://github.com/amethystsoft/vein/issues")
                            .primaryButton()
                        Link("Report a vulnerability", destination: "https://github.com/amethystsoft/vein/security")
                            .primaryButton()
                    }
                }
                VStack {}
            }
        }
    }
}
