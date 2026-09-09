import Raptor

extension HTML {
    func hiddenOnMobile() -> some HTML {
        self.class("hidden-on-mobile")
            .class("lg:hidden-on-mobile")
    }
    
    func hiddenOnDesktop() -> some HTML {
        self.class("hidden-on-desktop")
            .class("lg:hidden-on-desktop")
    }
}

enum Font: String {
    case xxLarge = "font2XL"
    case xxxLarge = "font3XL"
}

extension HTML {
    func font(_ font: Font) -> some HTML {
        self
            .class(font.rawValue)
            .class("md:\(font.rawValue)")
    }
}

extension Image {
    func logoWidth() -> some InlineContent {
        self
            .class("logoWidth")
            .class("md:logoWidth")
    }
}
