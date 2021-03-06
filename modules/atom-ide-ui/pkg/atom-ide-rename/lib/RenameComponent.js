/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow strict-local
 * @format
 */

import * as React from 'react';
import {AtomInput} from 'nuclide-commons-ui/AtomInput';

type Props = {
  selectedText: string,
  submitNewName: (string | void) => void,
  parentEditor: atom$TextEditor,
};

type State = {
  newName: string,
};

export default class RenameComponent extends React.Component<Props, State> {
  _atomInput: ?AtomInput;

  constructor(props: Props) {
    super(props);

    this.state = {
      newName: this.props.selectedText,
    };
  }

  componentDidMount() {
    this._forceActivateInsertMode();
    this._highlightTextWithin();
  }

  // When using the `vim-mode-plus` package, the user has to press 'i' in 'normal-mode'
  //  to begin inserting text in an atom-text-editor - doing so sends
  //  an 'activate-insert-mode' command.
  // However, when the user wants to type in embedded text editors,
  //  we must first activate `insert-mode` in the parent editor.
  _forceActivateInsertMode = (): void => {
    const {parentEditor} = this.props;

    if (parentEditor != null) {
      atom.commands.dispatch(
        atom.views.getView(parentEditor),
        'vim-mode-plus:activate-insert-mode',
      );
    }
  };

  _highlightTextWithin = (): void => {
    if (this._atomInput == null) {
      return;
    }
    const editor = this._atomInput.getTextEditor();
    editor.selectAll();
  };

  _handleSubmit = (event: ?Event): void => {
    if (event == null) {
      return;
    }
    event.preventDefault();
    const {newName} = this.state;
    const {submitNewName} = this.props;

    return newName === '' ? submitNewName() : submitNewName(newName);
  };

  _handleChange = (text: string): void => {
    this.setState({newName: text});
  };

  _handleBlur = (event: Event): void => {
    this.props.submitNewName();
  };

  render(): React.Node {
    // TODO: Have a min-width, but expand the actual width as necessary based on the length of the selected word
    //      (What VSCode does)
    const widthStyle = {
      minWidth: '150px',
    };
    return (
      <AtomInput
        ref={atomInput => (this._atomInput = atomInput)}
        style={widthStyle}
        autofocus={true}
        value={this.state.newName}
        onDidChange={this._handleChange}
        onBlur={this._handleBlur}
        onConfirm={this._handleSubmit}
      />
    );
  }
}
