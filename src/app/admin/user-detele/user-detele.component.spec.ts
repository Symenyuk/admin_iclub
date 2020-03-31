import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeteleComponent } from './user-detele.component';

describe('UserDeteleComponent', () => {
  let component: UserDeteleComponent;
  let fixture: ComponentFixture<UserDeteleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeteleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeteleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
