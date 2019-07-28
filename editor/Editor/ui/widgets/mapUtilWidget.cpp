#include "mapUtilWidget.hpp"
#include "../../editor.hpp"

MapUtilWidget::MapUtilWidget(Editor * editor) : editorRef(editor), Widget("Map Utils") {}

#include <iostream>
void MapUtilWidget::define() {
    draw_text("SAVE", [&]() {
        editorRef->save_map();
    }, TextSize::SMALL);
    add_v_padding(20);
    draw_text("TILE", [&]() {
        editorRef->changeState(Editor::EditState::TILE);
    }, TextSize::MEDIUM, false);
    add_h_padding(0);
    draw_text("COLLISION", [&]() {
        editorRef->changeState(Editor::EditState::COLLISION);
    });
}