#include "mapUtilWidget.hpp"
#include "../../editor.hpp"

MapUtilWidget::MapUtilWidget(Editor * editor) : editorRef(editor), Widget("Map Utils", 0, 0) {}

#include <iostream>
void MapUtilWidget::define() {
    draw_text("SAVE", [&]() {
        editorRef->save_map();
    });
    draw_text("TILE", [&]() {
        editorRef->changeState(Editor::EditState::TILE);
    }, false);
    draw_text("  ", false);
    draw_text("COLLISION", [&]() {
        editorRef->changeState(Editor::EditState::COLLISION);
    });
}