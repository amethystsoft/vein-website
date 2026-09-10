import Foundation
import Raptor

@main
struct RaptorWebsite {
    static func main() async {
        var site = ExampleSite()

        do {
            try await site.publish()
        } catch {
            print(error.localizedDescription)
        }
    }
}

struct ExampleSite: Site {    
    var name = ""
    var titleSuffix = ""
    var url = URL(static: "https://vein.amethystsoft.de")
    
    nonisolated var themes: [any Theme] = [
        MainTheme()
    ]
    
    var author = "Mia Koring"

    var homePage = Home()
    var layout = MainLayout()
    var prettifyHTML: Bool = false
}

struct MainTheme: Theme {
    func theme(site: Content, colorScheme: ColorScheme) -> Content {
        if colorScheme == .dark {
            site.accent(Color(hex: "#DE69FF"))
        } else {
            site.accent(Color(hex: "#83239e"))
        }
    }
}
