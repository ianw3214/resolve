#include "mapUtilWidget.hpp"
#include "../../editor.hpp"

MapUtilWidget::MapUtilWidget(Editor * editor) : editorRef(editor), Widget("Map Utils") {}

#include <iostream>
void MapUtilWidget::define() {
    draw_text("SAVE", [&]() {
        editorRef->save_map();
    });
    new_line();
    draw_text("TILE", [&]() {
        editorRef->changeState(Editor::EditState::TILE);
    }, false);
    add_h_padding(30);
    draw_text("COLLISION", [&]() {
        editorRef->changeState(Editor::EditState::COLLISION);
    });
}