#include "mapPropertyWidget.hpp"
#include "../../editor.hpp"

MapPropertyWidget::MapPropertyWidget(Editor * editor) 
    : editorRef(editor), Widget("Map Properties") 
{
    m_map_width = std::to_string(editor->get_map_width());
    m_map_height = std::to_string(editor->get_map_height());
}

void MapPropertyWidget::define() {
    draw_image("resources/left.png", 32, 32, [&]() {
        editorRef->decrease_map_width();
        m_map_width = std::to_string(editorRef->get_map_width());
    });
    draw_text_ref(&m_map_width, TextSize::MEDIUM, false);
    draw_image("resources/right.png", 32, 32, [&]() {
        editorRef->increase_map_width();
        m_map_width = std::to_string(editorRef->get_map_width());
    });

    new_line();
    new_line();

    draw_image("resources/left.png", 32, 32, [&]() {
        editorRef->decrease_map_height();
        m_map_height = std::to_string(editorRef->get_map_height());
    });
    draw_text_ref(&m_map_height, TextSize::MEDIUM, false);
    draw_image("resources/right.png", 32, 32, [&]() {
        editorRef->increase_map_height();
        m_map_height = std::to_string(editorRef->get_map_height());
    });

}