import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from 'src/bookmark/bookmark.controller';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
	constructor(private bookmarkService: BookmarkService) {}
	@Post()
	createBookmark() {}

	@Get()
	getBookmarks() {}

	@Get()
	getBookmarksID() {}

	@Patch()
	editBookmarkByID() {}

	@Delete()
	deleteBookmark() {}
}
