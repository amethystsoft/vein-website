import Raptor

enum ImageKind {
    case system(String)
    case other(String)
    
    @HTMLBuilder
    func asIconImage() -> some HTML {
        switch self {
            case .system(let systemImage):
                Image(systemName: systemImage)
                    .font(.title1)
                    .foregroundStyle(.accent)
            case .other(let imagePath):
                Image(imagePath)
                    .resizable()
                    .style(.width(.em(3.3)))
                    .foregroundStyle(.accent)
        }
    }
}
