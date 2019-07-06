#pragma once
#include "widget.hpp"

#include <string>

class Editor;
class TilePaletteWidget : public Widget {
public:
    // TODO: Don't need separate map_src, can probably get straight from editor
    TilePaletteWidget(Editor * editor, const std::string & map_src);
    virtual void define() override;
private:
    Editor * editorRef;

    std::string map_src;
    std::string m_tilesheet_src;
    int m_tile_size;
    int m_tilesheet_width;
    int m_tilesheet_height;
};