import Raptor

struct SecondaryLinkButton: HTML {
    let link: String
    var text: String = "Learn more"
    
    var body: some HTML {
        LinkGroup(destination: link) {
            HStack(spacing: 5) {
                Text("Learn more")
                Image(systemName: "chevron-right")
            }
            .font(.title5)
            .fontWeight(.medium)
            .foregroundStyle(.primary)
        }
        .linkOpenBehavior(.frame("_blank"))
    }
}
