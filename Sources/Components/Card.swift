import Raptor

struct Card: HTML {
    let image: ImageKind
    let title: String
    let description: String
    let link: String
    
    var body: some HTML {
        VStack(alignment: .leading) {
            image.asIconImage()
            
            Text(title)
                .font(.title2)
                .fontWeight(.medium)
            Text(description)
                .font(.body)
                .foregroundStyle(.secondary)
            SecondaryLinkButton(link: link)
        }
        .padding(40)
        .cornerRadius(20)
        .background(.accent.opacity(0.1))
    }
}
