#pragma once
#include "widget.hpp"

class Editor;
class MapPropertyWidget : public Widget {
    
public:
    MapPropertyWidget(Editor * editor);
    virtual void define() override;
private:
    Editor * editorRef;

    std::string m_map_width;
    std::string m_map_height;
};