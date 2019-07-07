#include "mapUtilWidget.hpp"
#include "../../editor.hpp"

MapUtilWidget::MapUtilWidget(Editor * editor) : editorRef(editor), Widget("Map Utils", 0, 0) {}

#include <iostream>
void MapUtilWidget::define() {
    draw_text("SAVE", [&]() {
        editorRef->save_map();
    });
}