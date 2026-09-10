import Raptor

struct Navbar: HTML {
    var body: some HTML {
        Include("navbar.html")
        Tag("scroll-navbar") {
            HStack {
                Spacer()
                Menu("Docs") {
                    Link("Vein", destination: .docLink("vein"))
                        .linkOpenBehavior(.frame("_blank"))
                    Link("VeinCore", destination: .docLink("veincore"))
                        .linkOpenBehavior(.frame("_blank"))
                    Link("VeinSwiftUI", destination: .docLink("veinswiftui"))
                        .linkOpenBehavior(.frame("_blank"))
                    Link("VeinSCUI", destination: .docLink("veinscui"))
                        .linkOpenBehavior(.frame("_blank"))
                    Link("ULID", destination: .docLink("ulid"))
                        .linkOpenBehavior(.frame("_blank"))
                } primaryAction: {
                    .custom(#"window.open("\#(String.docLink("vein"))");"#)
                }
                .menuDropdownStyle(MenuStyle())
                Menu("Tutorials") {
                    Link("Meet Vein", destination: .tutorial())
                        .linkOpenBehavior(.frame("_blank"))
                    Link("VeinSwiftUI", destination: .tutorial("swiftui-table-of-contents"))
                        .linkOpenBehavior(.frame("_blank"))
                    Link("VeinSCUI", destination: .tutorial("scui-table-of-contents"))
                        .linkOpenBehavior(.frame("_blank"))
                } primaryAction: {
                    .custom(#"window.open("\#(String.tutorial("table-of-contents"))");"#)
                }
                .menuDropdownStyle(MenuStyle())
                Link("Sponsor", destination: "https://github.com/sponsors/MiaKoring")
                    .primaryButton()
            }.padding(5)
            .background(.thinMaterial)
        }
    }
}

extension String {
    static func docLink(_ destination: String) -> Self {
        "https://docs.vein.amethystsoft.de/documentation/\(destination)"
    }
    static func tutorial(_ destination: String = "table-of-contents") -> Self {
        "https://docs.vein.amethystsoft.de/tutorials/\(destination)"
    }
}

struct MenuStyle: MenuDropdownStyle {
    func style(content: Content) -> Content {
        content
            .dropdownItemCornerStyle(.rounded)
            .dropdownItemHoverEffect(.tint(.secondary))
            .cornerRadius(27)
    }
}
