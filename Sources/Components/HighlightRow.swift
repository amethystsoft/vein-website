import Raptor

struct HighlightRow: HTML {
    let icon: ImageKind
    let title: String
    let description: String
    let link: String
    
    let code: String
    let codeSide: HorizontalAlignment
    
    var body: some HTML {
        ZStack {
            desktopRow().hiddenOnMobile()
            mobileRow().hiddenOnDesktop()
        }
    }
    
    func mobileRow() -> some HTML {
        Grid(spacing: 10) {
            GridRow {
                CodeBlock(.swift) { code }
                    .lineNumberVisibility(.hidden)
                    .cornerRadius(15)
                
                VStack {
                    icon.asIconImage()
                    Text(title)
                        .font(.title1).fontWeight(.medium)
                    
                    Text(description)
                        .foregroundStyle(.secondary)
                    
                    Link("Get Started", destination: link)
                        .linkOpenBehavior(.frame("_blank"))
                        .primaryButton()
                }
            }
        }
    }
    
    func desktopRow() -> some HTML {
        Grid(spacing: 50) {
            GridRow {
                if codeSide == .leading {
                    CodeBlock(.swift) { code }
                        .lineNumberVisibility(.hidden)
                        .cornerRadius(15)
                }
                
                VStack(alignment: .leading) {
                    icon.asIconImage()
                    Text(title)
                        .font(.title1).fontWeight(.medium)
                    
                    Text(description)
                        .foregroundStyle(.secondary)
                    
                    Link("Get Started", destination: link)
                        .linkOpenBehavior(.frame("_blank"))
                        .primaryButton()
                }
                
                if codeSide == .trailing {
                    CodeBlock(.swift) { code }
                        .lineNumberVisibility(.hidden)
                        .horizontalAlignment(.trailing)
                        .cornerRadius(15)
                }
            }
        }
    }
}
