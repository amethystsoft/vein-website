import Raptor

struct FAQs: HTML {
    var body: some HTML {
        Text("FAQs")
        .font(.title1)
        .fontWeight(.medium)
        .padding(.bottom, 10)
        FAQList {
            FAQItem(title: "Does Vein support Skip?") {
                Text("To use Vein with Skip, add Vein as a dependency and import VeinCore. Automatic UI reactivity is currently unsupported, but we still believe it's a valuable improvement of comfort over plain SQL.")
            }
            FAQItem(title: "How is Vein tested?") {
                Text(markdown: """
                Vein is tested automatically on macOS, Linux, Android and Windows. It's test suite contains property based tests, multihreaded tests, macro expansion tests and regular unit/integration tests. 
                
                On macOS and Linux the full test suite is ran with thread sanitizer enabled.
                
                Mid October 2026 there is a test to framework code ratio of about 1.3 to 1.
                """)
            }
            FAQItem(title: "What platforms and versions are supported?") {
                Text(markdown: """
                Vein supports Apple platforms starting at iOS 16 and macOS 13 (with the 'VeinFilter' trait), without 'VeinFilter' support starts at iOS 17 and macOS 14, due to the availability of `#Predicate`.
                
                Linux and Windows are supported with Swift 6.2 or later.
                
                Android is supported with Swift 6.4 or later.
                
                VeinSCUI supports versions 0.8.0 or later with the 'VeinSCUI' trait enabled.
                """)
            }
        }
    }
}

struct FAQList<C: HTML>: HTML {
    @HTMLBuilder
    var content: () -> C
    var body: some HTML {
        Include("faq.html")
        Tag("faq-list") {
            content()
        }
    }
}

struct FAQItem<C: HTML>: HTML {
    let title: String
    @HTMLBuilder
    var content: () -> C
    var body: some HTML {
        Include("faq.html")
        Tag("faq-item") {
            content()
        }
            .attribute("title", title)
    }
}
