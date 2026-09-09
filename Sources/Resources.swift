enum Resources {
    static var firstExampleCode: String {
        #"""
        import VeinCore
        
        enum V0_0_1: VersionedSchema {
            static let version = ModelVersion(0, 0, 1)
            static let models: [any PersistentModel.Type] = [Post.self, Tag.self]
        
            @Model
            final class Post {
                var title: String
        
                @LazyField
                var content: String
        
                @Relationship(inverse: \Tag.posts)
                var tags: [Tag]
        
                init(title: String, content: String) { /* ... */ }
            }
        
            @Model
            final class Tag {
                var name: String
        
                @Relationship
                var posts: [Post]
                /* ... */
            }
        }
        """#
    }
    
    static var firstHighlightCode: String {
        #"""
        static let v1toV2 = MigrationStage.complex(
            fromVersion: V1.self,
            toVersion: V2.self,
            willMigrate: { context in
                try V1.Tag.unchangedMigration(
                    to: V2.Tag.self,
                    on: context
                )
        
                try V1.Post.fieldsAddedMigration(
                    to: V2.Post.self
                    on: context
                )
            }, didMigrate: nil)
        }
        """#
    }
    
    static var secondHighlightCode: String {
        #"""
        let descriptor = try FetchDescriptor(
            predicate: #Predicate<V0_0_1.Post> { post in
                post.title.contains("Vein")
                || post.title.starts(with: "Swift")
            },
            sortBy: [SortRule(\.id)]
        )
        
        let results = try context.fetch(descriptor)
        // ---- OR -----
        let results = try context.fetchAll(
            #Predicate<V0_0_1.Post> { post in
                post.title.contains("Vein")
                || post.title.starts(with: "Swift")
            }
        )
        """#
    }
    
    static var thirdHighlightCode: String {
        #"""
        import VeinSwiftUI
        
        struct PostList: View {
            @Query(sortBy: [SortRule(\.id, order: .descending)
            var posts: [Post]
        
            var body: some View {
                List(posts) { post in
                    Text(post.title)
                }
            )
        }
        """#
    }
    
    static var fourthHighlightCode: String {
        #"""
        import Testing
        import VeinCore
        import VeinTesting
        
        @Test
        func testMigration() async throws {
            let tester = try MigrationTester(
                migrationPlan: MigrationPlan.self
            )
            try tester.testCompleteChain(
                initialData: { context in
                    // Seed the context
                },
                validations: [
                    V2.version: { context in
                        // Validate V1 to V2 here
                    }
                ]
            )
        }
        """#
    }
}
