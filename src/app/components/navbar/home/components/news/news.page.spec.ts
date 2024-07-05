import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsPage } from './news.page';

describe('NewsPage', () => {
  let component: NewsPage;
  let fixture: ComponentFixture<NewsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
