import {Component, OnInit} from '@angular/core';
import {StudentService} from '../student.service';
import {SettingsService} from '../../../core/settings/settings.service';
import {Page} from '../../../core/page/page';
import {Router} from '@angular/router'

@Component({
	selector: 'app-my-collection',
	templateUrl: './my-collection.component.html',
	styleUrls: ['./my-collection.component.css']
})
export class MyCollectionComponent implements OnInit {
	public studentCode: string;               // 学生编码
	public favoriteData: Page = new Page();     // 收藏的教师数据

	constructor(public student: StudentService, public setting: SettingsService) {
	}

	ngOnInit() {
		this.studentCode = this.setting.user.studentCode;           // 初始化学生编码
		let data = this.student.getfavorite(this.studentCode, this.favoriteData.curPage || 1, this.favoriteData.pageSize || 10);   // 初始化收藏教师数据
		this.favoriteData = new Page(data);          // 封装处理收藏教师数据为Page对象
	}

	/**
	 * 取消收藏教师
	 * @param tutor         教师对象
	 */
	delFavorite(tutor) {
		this.student.delfavorite(tutor.tutorCode, this.studentCode, res => {
			tutor.state = 'Delete';             // 取消收藏成功修改教师状态
		});
	};

	/**
	 * 加载更多数据
	 */
	loadMore() {
		let data = this.student.getfavorite(this.studentCode, ++this.favoriteData.curPage || 1, this.favoriteData.pageSize || 10);
		this.favoriteData = new Page(data);
	}

}
