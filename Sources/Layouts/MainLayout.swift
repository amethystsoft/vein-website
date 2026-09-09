import Foundation
import Raptor

struct MainLayout: Layout {

    var body: some Document {
        Main {
            Navbar()
            content
        }
        Footer {
            VStack(alignment: .center) {
                Text("Amethyst Vein is an independent open-source project and is not affiliated with, sponsored, or endorsed by Apple Inc. SwiftUI and SwiftData trademarks of Apple Inc., registered in the U.S. and other countries.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: 800)
                Link("Imprint", destination: "https://www.miakoring.de/impressum")
                Text {
                    "Created in Swift with "
                    Link("Raptor", destination: URL(static: "https://raptor.build"))
                }
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
            }.padding(.top, 90)
        }
    }
}
