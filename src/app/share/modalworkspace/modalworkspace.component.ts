import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Board} from "../../model/board";
import {UserToken} from "../../model/user-token";
import {Workspace} from "../../model/workspace";
import {ModalService} from "../../service/modal/modal.service";
import {BoardService} from "../../service/board/board.service";
import {AuthenticateService} from "../../service/authenticate.service";
import {ToastService} from "../../service/toast/toast.service";
import {ColumnService} from "../../service/column/column.service";
import {WorkspaceService} from "../../service/workspace/workspace.service";

@Component({
  selector: 'app-modalworkspace',
  templateUrl: './modalworkspace.component.html',
  styleUrls: ['./modalworkspace.component.css']
})
export class ModalworkspaceComponent implements OnInit {
  @Input() workspace: Workspace = {
    boards: [],
    id: 0,
    members: [],
    owner: undefined,
    title: "",
    type: "Công nghệ",
    privacy: "Riêng tư"
  };
  boards: Board[] = [];
  loggedInUser!: UserToken;
  @Output() workspaces = new EventEmitter<Workspace[]>();
  @Output() workspacesPublic = new EventEmitter<Workspace[]>();
  constructor(private modalService: ModalService,
              private boardService: BoardService,
              private authenticateService: AuthenticateService,
              private toastService: ToastService,
              private columnService: ColumnService,
              private workspaceService: WorkspaceService) {
  }

  ngOnInit(): void {
    this.loggedInUser = this.authenticateService.getCurrentUserValue()
    this.getAllWorkspace();
    this.getWorkspaces()
  }

  hideCreateWorkspaceModal() {
    this.resetWorkspaceInput()
    document.getElementById('create-workspace')!.classList.remove('is-active');
  }

  getAllWorkspace() {
    this.workspaceService.findAll().subscribe(data => {
      this.workspacesPublic.emit(data);
    })
  }

  getWorkspaces() {
    this.workspaceService.findAllByOwnerId(this.loggedInUser.id).subscribe(data => {
      this.workspaces.emit(data);
    })
  }

  createWorkspace() {
    this.workspace.owner = this.loggedInUser;
    this.workspaceService.createWorkspace(this.workspace).subscribe(() => {
      this.getWorkspaces();
      this.toastService.showMessage("Tạo nhóm thành công", 'is-success');
      this.hideCreateWorkspaceModal();
      this.getAllWorkspace()
    })
  }

  resetWorkspaceInput() {
    this.workspace = {boards: [], id: 0, members: [], owner: undefined, title: "", type: "", privacy: ""};
  }

}
