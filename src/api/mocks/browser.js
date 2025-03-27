import { setupWorker } from 'msw/browser';

import { common_handlers } from './common_handlers';
import { helper_handler } from './helper_handlers';
import { keyword_mng_handler } from './keyword_mng_handlers';
import { member_handler } from './member_handlers';
import { site_mng_handler } from './site_mng_handlers';
import { snsacount_handler } from './snsacount_handlers';
import { data_mng_handler } from './data_mng';
import { dictionary_handler } from './dictionary_handlers';
import { replace_handler } from './replace_handlers';
import { classify_handlers } from './classify_handlers';
import { excel_data_handler } from './excel_data';
import { log_handler } from './log_handlers';
import { except_handler } from './except_handlers';
import { site_search_handler } from './site_search_handlers';
import { site_board_handler } from './siteboard_handlers';
import { popularity_handler } from './popularity_handlers';

export const worker = setupWorker(...common_handlers, ...keyword_mng_handler, ...member_handler, ...site_mng_handler, ...snsacount_handler, ...data_mng_handler, ...dictionary_handler, ...replace_handler, ...classify_handlers, ...excel_data_handler, ...log_handler, ...helper_handler, ...except_handler, ...site_search_handler, ...site_board_handler, ...popularity_handler);
// export const worker = setupWorker(...helper_handlers);
