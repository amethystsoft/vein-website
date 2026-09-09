import Raptor

struct SubSection2: HTML {
    var body: some HTML {
        VStack(spacing: 200) {
            HighlightRow(
                icon: .system("arrow-left-right"),
                title: "Simple, safe migrations",
                description: "Vein utilizes explicit migrations to ensure data integrity. Helpers let you handle simple schema updates, complex changes are made through fetch-transform-delete. If a migration is incomplete, Vein automatically reverts it to prevent data corruption.",
                link: .tutorial(),
                code: Resources.firstHighlightCode,
                codeSide: .trailing
            )
            
            HighlightRow(
                icon: .system("search"),
                title: "Swifty Queries",
                description: "Vein supports query building using idiomatic Swift. Use #Predicate or #Filter, writing a closure like you would for filter(_:) or create a ModelPredicate if you want direct control over the query.",
                link: .tutorial(),
                code: Resources.secondHighlightCode,
                codeSide: .leading
            )
            
            HighlightRow(
                icon: .system("grid-1x2"),
                title: "Direct UI integration",
                description: "Vein integrates directly with SwiftUI and SwiftCrossUI Views via the declarative, auto-updating @Query property wrapper and ObservableObject models.",
                link: .tutorial(),
                code: Resources.thirdHighlightCode,
                codeSide: .trailing
            )
            
            HighlightRow(
                icon: .system("database-up"),
                title: "Migration Test Support",
                description: "Migrations going wrong are a common case for data loss. To help you prevent that, Vein comes with VeinTesting, a thin layer on top of Vein to make testing migrations more pleasant.",
                link: .tutorial(),
                code: Resources.fourthHighlightCode,
                codeSide: .leading
            )
        }
    }
}
